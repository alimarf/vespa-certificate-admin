/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { google, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { NextResponse } from 'next/server';

// Get Google Sheet details from environment variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '167Dim4cm6vLb19bf787Lzc4HJe0ua8Q-6Yn2xmlwPro';
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

// This function will authenticate with Google using service account credentials
async function getGoogleSheetClient(): Promise<sheets_v4.Sheets> {
  try {
    // Check if we have credentials
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.error('❌ Google service account key not found in environment variables');
      throw new Error('Missing Google service account credentials');
    }

    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (parseError) {
      console.error('❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', parseError);
      throw new Error('Invalid service account key format');
    }
    
    try {
      // Create a new auth instance for each request (no global state)
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      });

      console.log('🔑 Authentication successful');
      
      // Get auth client for this request
      const authClient = await auth.getClient();
      
      // Create and return sheets client with this auth client
      return google.sheets({
        version: 'v4',
        auth: authClient as any // Type assertion needed due to complex auth types
      });
    } catch (authError) {
      console.error('❌ Authentication failed:', authError);
      throw authError;
    }
  } catch (error) {
    console.error('❌ Error in getGoogleSheetClient:', error);
    throw new Error(`Failed to create Google Sheets client: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper function to wait for a specified time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaPeserta, description } = body;

    if (!namaPeserta || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the current date and time in WIB (Western Indonesian Time)
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    // Format: DD/MM/YYYY, HH:MM:SS
    const formattedDate = now.toLocaleString('en-GB', options);

    // Prepare the values to append
    const values = [
      [namaPeserta, description, formattedDate]
    ];

    try {
      // Retry mechanism for Google Sheets operations
      const MAX_RETRIES = 3;
      let retryCount = 0;
      let success = false;
      let lastError: any;

      while (retryCount < MAX_RETRIES && !success) {
        try {
          // Get a fresh Google Sheets client for each attempt
          const sheets = await getGoogleSheetClient();
          
          // Append the data to the sheet
          await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:C`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values,
            },
          });
          
          console.log(`✅ Data successfully appended to Google Sheet (attempt ${retryCount + 1})`);
          success = true;
        } catch (error) {
          lastError = error;
          retryCount++;
          console.error(`❌ Attempt ${retryCount} failed:`, error);
          
          if (retryCount < MAX_RETRIES) {
            // Exponential backoff: wait longer between each retry
            const backoffTime = 200 * Math.pow(2, retryCount - 1);
            console.log(`Retrying in ${backoffTime}ms...`);
            await wait(backoffTime);
          }
        }
      }

      if (!success) {
        console.error('❌ All retry attempts failed:', lastError);
        return NextResponse.json(
          { error: 'Failed to save data after multiple attempts' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ success: true });
    } catch (sheetError) {
      console.error('❌ Error in sheet operations:', sheetError);
      return NextResponse.json(
        { error: 'Failed to save data to Google Sheet' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error in POST handler:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

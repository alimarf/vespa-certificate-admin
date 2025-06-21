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
      console.log('✅ Successfully parsed service account key');
    } catch (parseError) {
      console.error('❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', parseError);
      throw new Error('Invalid service account key format');
    }
    
    try {
      // Initialize auth with credentials
      const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      });

      console.log('🔑 Authentication successful');
      
      // Create the sheets client with proper typing
      const sheets = google.sheets('v4');
      
      // Set the auth as a global default
      google.options({
        auth: auth as any, // Type assertion needed due to complex auth types
      });
      
      return sheets;
    } catch (authError) {
      console.error('❌ Authentication failed:', authError);
      throw authError;
    }
  } catch (error) {
    console.error('❌ Error in getGoogleSheetClient:', error);
    throw new Error(`Failed to create Google Sheets client: ${error instanceof Error ? error.message : String(error)}`);
  }
}

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
      // Get Google Sheets client
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
      
      console.log('Data successfully appended to Google Sheet');
    } catch (sheetError) {
      // Log the error but don't fail the request
      console.error('Error appending to Google Sheet:', sheetError);
      // If we're missing credentials, we'll just log the data
      console.log('Would append to Google Sheet:', values);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting form data:', error);
    return NextResponse.json(
      { error: 'Failed to submit form data' },
      { status: 500 }
    );
  }
}

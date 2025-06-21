import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sheetId, data } = body;
    
    // Log the received data
    console.log('Verifying submission for sheet:', sheetId);
    console.log('Data:', data);
    
    // For now, we'll just return success
    // In a real implementation, you could use Google Sheets API to verify
    // that the data was actually added to the sheet
    
    return NextResponse.json({ 
      success: true, 
      message: 'Verification request received',
      data: data
    });
  } catch (error) {
    console.error('Error in verify-submission API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process verification request' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const modelsDir = path.join(process.cwd(), 'public', 'glbs');
    const files = fs.readdirSync(modelsDir)
      .filter(file => file.endsWith('.glb'));
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error reading model files:', error);
    return NextResponse.json({ error: 'Failed to load models' }, { status: 500 });
  }
} 
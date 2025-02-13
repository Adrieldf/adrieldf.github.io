import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const shadersDir = path.join(process.cwd(), 'public', 'shaders');
    const files = fs.readdirSync(shadersDir)
      .filter(file => file.endsWith('.glsl'));
    
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error reading shader files:', error);
    return NextResponse.json({ error: 'Failed to load shaders' }, { status: 500 });
  }
} 
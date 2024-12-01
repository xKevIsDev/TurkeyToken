import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const scoreSchema = z.object({
  name: z.string().min(1).max(20),
  score: z.number().int().positive(),
  level: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    // Validate Supabase connection
    if (!supabase) {
      console.error('Supabase client not initialized');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const result = scoreSchema.safeParse(body);
    
    if (!result.success) {
      console.error('Invalid score data:', result.error);
      return NextResponse.json(
        { error: 'Invalid score submission' },
        { status: 400 }
      );
    }

    const { name, score, level } = result.data;

    // Insert the new score
    const { data: insertedData, error: insertError } = await supabase
      .from('leaderboard')
      .insert([{ name, score, level }])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        { error: 'Database insert error' },
        { status: 500 }
      );
    }

    // Get the rank
    const { count: rankCount, error: rankError } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .gt('score', score);

    if (rankError) {
      console.error('Rank calculation error:', rankError);
      return NextResponse.json(
        { error: 'Rank calculation error' },
        { status: 500 }
      );
    }

    const rank = (rankCount ?? 0) + 1;

    return NextResponse.json({
      success: true,
      rank,
      name,
      score,
      level,
      timestamp: new Date(insertedData.created_at).getTime(),
    });
  } catch (error) {
    console.error('Score submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Validate Supabase connection
    if (!supabase) {
      console.error('Supabase client not initialized');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Leaderboard fetch error:', error);
      return NextResponse.json(
        { error: 'Database query error' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json([]);
    }

    return NextResponse.json(
      data.map((entry, index) => ({
        rank: index + 1,
        name: entry.name,
        score: entry.score,
        level: entry.level,
        timestamp: new Date(entry.created_at).getTime(),
      }))
    );
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' }, 
      { status: 500 }
    );
  }
} 
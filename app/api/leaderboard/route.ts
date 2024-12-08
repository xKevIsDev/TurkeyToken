import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';
import { validateScore } from '@/lib/middleware/validateScore';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const scoreSchema = z.object({
  name: z.string().min(1).max(20),
  score: z.number().int().positive(),
  level: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    // Validate request origin
    const headersList = headers();
    const origin = headersList.get('origin');
    if (!origin?.includes(process.env.NEXT_PUBLIC_APP_URL || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Validate Supabase connection
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized');
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

    // Validate score
    if (!validateScore(score, level)) {
      return NextResponse.json(
        { error: 'Invalid score detected' },
        { status: 400 }
      );
    }

    // Insert the new score
    const { data: insertedData, error: insertError } = await supabaseAdmin
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
    const { count: rankCount, error: rankError } = await supabaseAdmin
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
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Validate Supabase connection
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized');
      return NextResponse.json(
        { error: 'Database connection error' },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
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
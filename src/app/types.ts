export type CategoryId = 'warmup' | 'receive' | 'attack' | 'serve' | 'game' | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  color: string; // Tailwind class or hex
}

// A drill is one block of practice. Duration is per-set; total active time is computed as
// (durationMin*60 + durationSec) * sets + restSeconds * (sets - 1), with prepTimeSeconds
// added before the block. See the `timeline` memo in MenuEditor for the canonical formula.
export interface Drill {
  id: string;
  name: string;
  categoryId: CategoryId;
  durationMin: number;
  durationSec: number;
  sets: number;
  restSeconds: number;
  description: string;
  prepTimeSeconds: number; // idle time inserted before this block starts
}

// A drill placed on the timeline. uniqueId keeps drag-and-drop keys stable even when the
// same library drill is added more than once.
export interface TimelineItem extends Drill {
  uniqueId: string;
}

export interface Menu {
  id: string;
  title: string;
  noteTitle?: string;
  noteBody?: string;
  baseDate: string;
  baseStartTime: string;
  items: TimelineItem[];
  updatedAt: string;
}

export const CATEGORIES: Category[] = [
  { id: 'warmup', name: 'ウォームアップ', color: 'bg-purple-500' },
  { id: 'receive', name: 'レシーブ', color: 'bg-orange-500' },
  { id: 'attack', name: '攻撃', color: 'bg-blue-800' },
  { id: 'serve', name: 'サーブ', color: 'bg-green-600' },
  { id: 'game', name: 'ゲーム練習', color: 'bg-red-600' },
  { id: 'other', name: 'その他', color: 'bg-gray-500' },
];

export const INITIAL_DRILLS: Drill[] = [
  {
    id: 'd1',
    name: 'ミーティング',
    categoryId: 'warmup',
    durationMin: 2,
    durationSec: 0,
    sets: 1,
    restSeconds: 0,
    prepTimeSeconds: 0,
    description: '',
  },
  {
    id: 'd2',
    name: 'ランニング',
    categoryId: 'warmup',
    durationMin: 3,
    durationSec: 0,
    sets: 1,
    restSeconds: 0,
    prepTimeSeconds: 60,
    description: '',
  },
  {
    id: 'd3',
    name: 'サーブ',
    categoryId: 'serve',
    durationMin: 2,
    durationSec: 0,
    sets: 3,
    restSeconds: 10,
    prepTimeSeconds: 60,
    description: '狙った箇所に強く確実に打つ',
  },
  {
    id: 'd4',
    name: '3枚キャッチ',
    categoryId: 'receive',
    durationMin: 2,
    durationSec: 0,
    sets: 4,
    restSeconds: 0,
    prepTimeSeconds: 60,
    description: 'メンバー:あら、なが、じゅん　反対側のコートでセッター練',
  },
];
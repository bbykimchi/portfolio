type Track = { id: string; name: string; artists: string[] };

function dedupeById(tracks: Track[]): Track[] {
  const seen = new Set<string>();
  return tracks.filter(t => (seen.has(t.id) ? false : (seen.add(t.id), true)));
}

function paginate<T>(items: T[], size: number, page: number): T[] {
  const start = page * size;
  return items.slice(start, start + size);
}

describe('track utils', () => {
  it('dedupeById removes duplicates by id', () => {
    const input: Track[] = [
      { id: '1', name: 'A', artists: ['X'] },
      { id: '1', name: 'A (dup)', artists: ['X'] },
      { id: '2', name: 'B', artists: ['Y'] },
    ];
    const out = dedupeById(input);
    expect(out).toHaveLength(2);
    expect(out.map(t => t.id)).toEqual(['1', '2']);
  });

  it('paginate returns a page slice', () => {
    const data = Array.from({ length: 10 }, (_, i) => i + 1);
    expect(paginate(data, 3, 0)).toEqual([1, 2, 3]);
    expect(paginate(data, 3, 1)).toEqual([4, 5, 6]);
    expect(paginate(data, 3, 3)).toEqual([10]);
  });
});

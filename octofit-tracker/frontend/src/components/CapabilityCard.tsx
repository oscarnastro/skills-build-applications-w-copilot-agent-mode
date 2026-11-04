import { useEffect, useState } from 'react';
import type { Key, ReactNode } from 'react';

type Props<T> = {
  title: string;
  description: string;
  loadData: () => Promise<Record<string, T[]>>;
  collectionKey: string;
  emptyMessage: string;
  itemKey: (item: T, index: number) => Key;
  renderItem: (item: T) => ReactNode;
};

export function CapabilityCard<T>({ title, description, loadData, collectionKey, emptyMessage, itemKey, renderItem }: Props<T>) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadData()
      .then((response) => {
        const collection = response[collectionKey];
        if (!Array.isArray(collection)) throw new Error('Unexpected API response');
        if (active) setItems(collection);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Request failed');
      });
    return () => { active = false; };
  }, [loadData, collectionKey]);

  return <section className="card h-100"><div className="card-body">
    <h2 className="h4">{title}</h2>
    <p>{description}</p>
    {error ? <p role="alert">Unable to load {title.toLowerCase()}: {error}</p> : items === null
      ? <p role="status">Loading {title.toLowerCase()}...</p>
      : items.length === 0
        ? <p role="status">{emptyMessage}</p>
        : <ul className="list-group list-group-flush">{items.map((item, index) => <li className="list-group-item" key={itemKey(item, index)}>{renderItem(item)}</li>)}</ul>}
  </div></section>;
}

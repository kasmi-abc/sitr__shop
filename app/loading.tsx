export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10" aria-busy="true">
      <div className="skeleton h-10 w-2/3 max-w-md" />
      <div className="skeleton h-4 w-1/3 max-w-xs" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] w-full" />
        ))}
      </div>
    </div>
  );
}

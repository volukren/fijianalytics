export default function AuthMethodsSeparator() {
  return (
    <div className="flex items-center gap-2">
      <div className="border-b border-neutral-200 flex-1" />
      <div className="text-neutral-500 font-medium uppercase text-xs">or</div>
      <div className="border-b border-neutral-200 flex-1" />
    </div>
  );
}

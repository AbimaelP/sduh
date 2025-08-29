export default function Checkbox({ className, checked, onChange }) {
  return (
    <input
      type="checkbox"
      className={`appearance-none rounded-full border-2 border-gray-700 flex items-center justify-center bg-white relative ${className}`}
      checked={checked}
      onChange={onChange}
    />
  );
}

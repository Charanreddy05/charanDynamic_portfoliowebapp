function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent text-[var(--text-main)] focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400"
      />
    </div>
  );
}

export default FormInput;

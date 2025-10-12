const ConfirmDialog = ({ visible, onConfirm, onCancel, message,   overlayClass = "bg-black/20 backdrop-blur-sm", }) => {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 ${overlayClass}`}
    >
      <div className="bg-white p-6 rounded-2xl w-[420px] shadow-xl border border-gray-100">
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 px-3 py-1 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

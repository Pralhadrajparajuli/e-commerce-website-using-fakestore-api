import useToastStore from "../store/toastStore";

const Toast = () => {
  const message = useToastStore((state) => state.message);
  const type = useToastStore((state) => state.type);

  if (!message) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[100] rounded-lg px-6 py-3 text-white shadow-lg ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-gray-800"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
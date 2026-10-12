import { toast } from "react-toastify";

export const showSuccess = (msg) => {
  toast.success(msg);
};

export const showError = (msg) => {
  toast.error(msg);
};

export const showInfo = (msg) => {
  toast.info(msg);
};

export const showWarning = (msg) => {
  toast.warning(msg);
};

// ⭐ BEST: promise toast (loading → success → error)
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    pending: messages?.pending || "Processing...",

    // ✅ SUCCESS CASE
    success: {
      render({ data }) {
        console.log("✅ API SUCCESS:", data);

        return messages?.success || "Success!";
      },
    },

    // ❌ ERROR CASE
    error: {
      render({ data }) {
        console.log("❌ API ERROR:", data);
        return (
          data?.response?.data?.message ||
          messages?.error ||
          "Something went wrong!"
        );
      },
    },
  });
};

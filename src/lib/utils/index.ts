import { Toaster, toast } from "svelte-sonner";

type SonnerToastProps = {
  type: string;
  desc: string;
};
export const Toast = ({ type, desc }: SonnerToastProps) => {
  switch (type) {
    case "success":
      toast.success(desc);
      break;
    case "info":
      toast.info(desc);
      break;
    case "warning":
      toast.warning(desc);
      break;
    case "error":
      toast.error(desc);
      break;
  }
};

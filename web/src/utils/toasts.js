import { toast as toast2 } from "react-hot-toast";

export const handleSuccessToast2 = (msg) => toast2.success(msg);
export const handleErrorToast2 = (msg) => toast2.error(msg);
export const handleToast2 = (msg) => toast2(msg);

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => <Sonner theme="light" position="top-center" richColors {...props} />;

export { Toaster };

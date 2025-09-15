import {NewPasswordForm} from "@/components/auth/new-password-form";

export default function NewPassword() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <NewPasswordForm />
            </div>
        </div>
    );
}

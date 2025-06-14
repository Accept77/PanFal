import LoginIllustration from '../LoginIllustration';
import FindPasswordForm from './FindPasswordForm';

export default function FindPasswordPage() {
    return (
        <div className="flex flex-col xl:flex-row xl:gap-[186px] gap-20 sm:justify-center bg-[#14151A] min-h-screen min-w-screen px-4">
            <LoginIllustration />
            <FindPasswordForm />
        </div>
    );
}

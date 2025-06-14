'use client';
import Link from 'next/link';
import {
    FieldError,
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import useMediaQuery from '@/hooks/useMediaQuery';

export default function FindPasswordForm() {
    const { register, handleSubmit, formState } = useForm<FieldValues>({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log(data);
    };
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="flex flex-col justify-center items-center gap-[14px] px-4 pb-8 sm:py-8 sm:px-[54px]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-[311px] sm:w-[500px] xl:w-[402px] h-auto"
            >
                <div>
                    <h1 className="text-white text-xl sm:text-2xl font-semibold leading-7 xl:leading-8 text-center mb-8">
                        비밀번호 찾기
                    </h1>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <Input
                                type="text"
                                placeholder="가입 시 등록한 이메일을 입력해주세요"
                                label="이메일"
                                name="userId"
                                labelClassName="text-sm mb-2 w-fit font-semibold leading-5"
                                size={!isMobile ? 'large' : 'small'}
                                register={register}
                                error={formState.errors.userId as FieldError}
                                rules={{
                                    required: '이메일을 입력해주세요',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: '이메일 형식에 맞지 않습니다.',
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                type="submit"
                                className="w-full mb-6"
                                disabled={!formState.isValid}
                            >
                                임시 비밀번호 발급
                            </Button>
                            <div className="flex gap-1 justify-center items-center">
                                <Link
                                    href="/login"
                                    className="text-gray-400 text-sm font-medium leading-5 underline underline-offset-2"
                                >
                                    ← 로그인 화면으로
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

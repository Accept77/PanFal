'use client';

import { useRef, useEffect } from 'react';
import { useForm, FieldValues, FieldError } from 'react-hook-form';

import BaseModal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Profile from '@/components/ui/Profile';
import { useGetUser } from '@/hooks/queries/useAuth';

interface EditProfileModalProps {
    onClose: () => void;
    onSubmit: (data: { nickname: string; profileImage?: File }) => void;
}

export default function EditProfileModal({
    onClose,
    onSubmit,
}: EditProfileModalProps) {
    const { data: user } = useGetUser();

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({ mode: 'onBlur' });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // file 필드 수동 등록
    useEffect(() => {
        register('file', {
            validate: {
                fileSize: (files) => {
                    if (!files || files.length === 0) return true;
                    const maxSize = 5 * 1024 * 1024; // 5MB
                    return (
                        files[0].size <= maxSize ||
                        '파일 크기는 5MB 이하여야 합니다'
                    );
                },
            },
        });
    }, [register]);

    const file = watch('file');
    const previewImage = file?.[0]
        ? URL.createObjectURL(file[0])
        : user?.img || '';

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setValue('file', e.target.files, { shouldValidate: true });
        }
    };

    const handleFormSubmit = (data: FieldValues) => {
        console.log('폼 제출 데이터:', {
            nickname: data.nickname,
            profileImage: data.file?.[0],
        });
        onSubmit({
            nickname: data.nickname,
            profileImage: data.file?.[0],
        });
    };

    return (
        <BaseModal onClose={onClose}>
            <div className="w-85.75 h-82 md:w-130 md:h-84 flex items-center justify-center">
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="w-73.75 h-70 md:w-118 md:h-72 flex flex-col gap-6"
                >
                    <div className="flex justify-between h-7 w-full items-center">
                        <p className="text-lg font-semibold">프로필 수정하기</p>
                    </div>

                    <div className="flex flex-col gap-6 h-41">
                        <Profile
                            size="large"
                            edit={true}
                            image={previewImage}
                            editButtonOnClick={handleImageClick}
                            editButtonClassName="cursor-pointer"
                        />

                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {errors.file && (
                            <span className="text-red-500 text-sm">
                                {(errors.file as FieldError).message}
                            </span>
                        )}

                        {/* 닉네임 입력 */}
                        <div className="h-18 md:h-19 flex flex-col justify-between">
                            <p className="h-5 md:h-6 text-sm md:text-base font-semibold">
                                닉네임
                            </p>
                            <Input
                                type="text"
                                name="nickname"
                                placeholder="닉네임을 입력해주세요"
                                register={register}
                                rules={{
                                    required: '닉네임은 필수 입력입니다.',
                                    minLength: {
                                        value: 2,
                                        message: '2글자 이상 입력해주세요.',
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: '10글자 이하로 입력해주세요.',
                                    },
                                }}
                                error={errors.nickname as FieldError}
                                size="small"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 h-10 md:h-12">
                        <Button
                            size="large"
                            type="button"
                            onClick={onClose}
                            styled="outline"
                        >
                            취소
                        </Button>
                        <Button size="large" type="submit" styled="solid">
                            수정하기
                        </Button>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
}

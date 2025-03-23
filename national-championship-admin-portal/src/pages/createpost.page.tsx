import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Alert, Upload, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { SelectProps } from 'antd';
import { getCookie } from '@/utils/extensions/get.cookies';
// Define the form data interface
interface FormData {
    title?: string;
    category?: string;
    image?: string;
    content?: string;
}

const { Option } = Select;

export default function CreatePost() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({});
    const [publishError, setPublishError] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const navigate = useNavigate();

    // TipTap editor setup
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        onUpdate: ({ editor }) => {
            setFormData({ ...formData, content: editor.getHTML() });
        },
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none border p-4 min-h-[300px]',
            },
        },
    });

    const handleFileChange: UploadProps['onChange'] = (info) => {
        if (info.fileList && info.fileList.length > 0) {
            // Extract the actual File object from the UploadFile
            const currentFile = info.fileList[0].originFileObj as File;

            if (currentFile) {
                console.log("Setting file:", currentFile);
                setFile(currentFile);
                // Keep only the latest file
                setFileList(info.fileList.slice(-1));
            }
        } else {
            // If fileList is empty, reset the file state
            setFile(null);
            setFileList([]);
        }
    }

    const handleUploadImage = async () => {
        console.log(">>>> Im here")
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress);
                },
                (error) => {
                    setImageUploadError('Image upload failed!');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(">>> Check error: ", error);
        }
    };

    const access_token_social = getCookie('access_token_social');
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token_social}` // Thêm Bearer token vào đây
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                navigate(`/`);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };

    // Category options
    const categoryOptions: SelectProps['options'] = [
        { value: 'uncategorized', label: 'Select a category' },
        { value: 'news', label: 'News' }, // Tin tức chung
        { value: 'injury-news', label: 'Injury News' }, // Tin chấn thương
        { value: 'transfers', label: 'Transfers' }, // Chuyển nhượng
        { value: 'squads', label: 'Squads' }, // Đội hình
        { value: 'matches', label: 'Match Reports' }, // Tường thuật trận đấu
        { value: 'tactics', label: 'Tactical Analysis' }, // Phân tích chiến thuật
        { value: 'statistics', label: 'Statistics & Records' }, // Thống kê & Kỷ lục
        { value: 'opinion', label: 'Opinion & Editorials' }, // Góc nhìn & Bình luận
        { value: 'fan-zone', label: 'Fan Zone' }, // Khu vực dành cho fan
        { value: 'history', label: 'Football History' }, // Lịch sử bóng đá
        { value: 'youth', label: 'Youth & Academy' }, // Đào tạo trẻ & Học viện
        { value: 'international', label: 'International Football' }, // Bóng đá quốc tế
        { value: 'domestic', label: 'Domestic Leagues' }, // Giải đấu quốc nội
        { value: 'awards', label: 'Awards & Recognitions' }, // Giải thưởng & Vinh danh
    ];


    return (
        <div className='p-6 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>
                CREATE A TOPIC
            </h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <Input
                        placeholder='Title'
                        required
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select a category"
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        options={categoryOptions}
                    />
                </div>

                <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
                    <Upload
                        listType="picture"
                        maxCount={1}
                        fileList={fileList}
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>

                    <div className="mt-2">
                        <Button
                            type="primary"
                            onClick={handleUploadImage}
                            disabled={!file || imageUploadProgress !== null}
                            style={{ marginTop: '10px' }}
                        >
                            Upload Image
                        </Button>

                        {imageUploadProgress !== null && (
                            <Progress percent={Math.round(imageUploadProgress)} status="active" style={{ marginTop: '10px' }} />
                        )}
                    </div>
                </div>

                {imageUploadError && (
                    <Alert message={imageUploadError} type="error" showIcon />
                )}

                {formData.image && (
                    <div className="mt-4">
                        <img src={formData.image} alt="upload" className='w-full h-72 object-cover rounded-md' />
                    </div>
                )}

                <div className="mt-4 mb-12">
                    <div className="mb-2 font-medium">Content</div>
                    <EditorContent editor={editor} className="border rounded-md" />
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{
                        background: 'linear-gradient(to right, #4ade80, #2dd4bf)',
                        height: '48px'
                    }}
                >
                    <span className="text-lg">Post</span>
                </Button>

                {publishError && (
                    <Alert message={publishError} type="error" showIcon style={{ marginTop: '20px' }} />
                )}
            </form>
        </div>
    );
}
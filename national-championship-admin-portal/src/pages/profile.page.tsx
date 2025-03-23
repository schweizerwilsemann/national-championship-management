import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Input, Progress, Upload, message } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/firebase';
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from '@/redux/user/userSlice';
import type { RcFile } from 'antd/es/upload/interface';
import axios from 'axios';

interface CurrentUser {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
}

interface UserState {
  currentUser: CurrentUser;
  error: string | null;
  loading: boolean;
}

interface RootState {
  user: UserState;
}

interface FormData {
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state: RootState) => state.user);
  const [imageFile, setImageFile] = useState<RcFile | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<number | null>(null);
  const [imageFileUploadingError, setImageFileUploadingError] = useState<string | null>(null);
  const [imageFileUploading, setImageFileUploading] = useState<boolean>(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(null);
  const [updateUserError, setUpdateUserError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  const dispatch = useDispatch();

  const handleImageChange = (info: any) => {
    const file = info.file as RcFile;
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + (imageFile?.name || '');
    const storageRef = ref(storage, fileName);

    if (!imageFile) return;

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress);
      },
      () => {
        setImageFileUploadingError('Could not upload image. Image must be less than 2MB!');
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        message.error('Upload failed. Image must be less than 2MB!');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
          message.success('Image uploaded successfully!');
        });
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ thêm trường vào formData nếu người dùng thực sự thay đổi giá trị
    const value = e.target.value;
    const fieldId = e.target.id;

    // Chỉ thêm vào formData nếu giá trị khác rỗng và khác với giá trị hiện tại
    if (fieldId === 'username' && value && value !== currentUser.username) {
      setFormData({ ...formData, username: value });
    } else if (fieldId === 'email' && value && value !== currentUser.email) {
      setFormData({ ...formData, email: value });
    } else if (fieldId === 'password' && value) {
      setFormData({ ...formData, password: value });
    } else if (value === '') {
      // Xóa trường khỏi formData nếu người dùng xóa giá trị
      const updatedFormData = { ...formData };
      delete updatedFormData[fieldId as keyof FormData];
      setFormData(updatedFormData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made!');
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload!');
      return;
    }

    try {
      dispatch(updateStart());

      // Chỉ gửi các trường đã thay đổi
      const updatedFields = { ...formData };

      // Gửi request tới API chính
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Chỉ update API thứ hai nếu cần thiết (có các trường liên quan)
      if (formData.username || formData.email || formData.password) {
        try {
          const profileResponse = await axios.get(`/api/v1/auth/profile`);

          if (profileResponse.data.statusCode === 200) {
            const userId = profileResponse.data.user.id;

            // Tạo payload chỉ với các trường cần thiết cho API thứ hai
            const mainDbPayload: any = {};
            if (formData.username) mainDbPayload.name = formData.username;
            if (formData.email) mainDbPayload.email = formData.email;
            if (formData.password) mainDbPayload.password = formData.password;

            // Chỉ gửi request nếu có dữ liệu cần update
            if (Object.keys(mainDbPayload).length > 0) {
              await axios.put(`/api/v1/users/update/${userId}`, mainDbPayload);
            }
          }
        } catch (secondApiError) {
          console.error("Failed to update second API:", secondApiError);
          // Không throw lỗi ở đây để không ảnh hưởng đến quá trình update chính
        }
      }

      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User's profile updated successfully!");
      message.success("Profile updated successfully!");

      // Reset formData sau khi update thành công
      setFormData({});

    } catch (error: any) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };


  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto p-6 w-full">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <Upload
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageChange}
              className="flex justify-center"
            >
              {imageFileUrl || currentUser.profilePicture ? (
                <div className="relative w-full h-full">
                  {imageFileUploadingProgress && imageFileUploadingProgress < 100 && (
                    <Progress
                      type="circle"
                      percent={imageFileUploadingProgress}
                      size={100}
                      className="absolute top-0 left-0 z-10"
                    />
                  )}
                  <img
                    src={imageFileUrl || currentUser.profilePicture}
                    alt="user"
                    className={`w-full h-full object-cover rounded-full ${imageFileUploadingProgress && imageFileUploadingProgress < 100 ? 'opacity-60' : ''
                      }`}
                  />
                </div>
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
        </div>

        {imageFileUploadingError && (
          <Alert message={imageFileUploadingError} type="error" showIcon />
        )}

        <div className="flex items-center gap-2">
          <Input
            id="username"
            prefix={<UserOutlined />}
            placeholder="Username"
            defaultValue={currentUser.username}
            onChange={handleChange}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            id="email"
            prefix={<MailOutlined />}
            placeholder="Email"
            defaultValue={currentUser.email}
            disabled
            onChange={handleChange}
            className="flex-1"
          />

        </div>

        <div className="flex items-center gap-2">
          <Input.Password
            id="password"
            prefix={<LockOutlined />}
            placeholder="Password"
            onChange={handleChange}
            className="flex-1"
          />
        </div>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading || imageFileUploading}
          disabled={loading || imageFileUploading}
        >
          {loading ? 'Loading...' : 'Update'}
        </Button>

        {currentUser.isAdmin && (
          <Link to="/create-post">
            <Button type="primary" style={{ width: '100%', background: '#722ed1' }}>
              Create a post
            </Button>
          </Link>
        )}
      </form>

      {updateUserSuccess && (
        <Alert message={updateUserSuccess} type="success" showIcon className="mt-5" />
      )}

      {updateUserError && (
        <Alert message={updateUserError} type="error" showIcon className="mt-5" />
      )}
    </div>
  );
}
import { useState } from 'react'
import { Upload, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import type { UploadFile, UploadProps } from 'antd'
import { uploadToCloudinary } from '../../api/client.api'
import { ICloudinaryUploadResponse } from 'entix-shared'

type IAvatarUploaderProps = {
  onUploaded: (response: ICloudinaryUploadResponse) => Promise<void>
}

export const AvatarUploader = ({ onUploaded }: IAvatarUploaderProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onChange: UploadProps['onChange'] = async ({
    file,
    fileList: newFileList,
  }) => {
    if (file.status === 'done') {
      message.success(`${file.name} file uploaded successfully.`)
      setFileList(newFileList.slice(-1)) // Maintain only the last uploaded file in the list
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`)
    } else {
      setFileList(newFileList) // Update file list if file is being uploaded
    }
  }

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    if (!file) return

    setUploading(true)

    try {
      // Upload to Cloudinary
      const data = await uploadToCloudinary(file)
      await onUploaded(data)
      // Set the file URL to the file's response URL
      file.url = data.secure_url
      setFileList([file])
      onSuccess?.(data, file)
    } catch (error) {
      console.error('Upload error:', error)
      onError?.(error)
      message.error('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as File)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  return (
    <ImgCrop rotationSlider>
      <Upload
        customRequest={customRequest}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        maxCount={1} // Allow only a single file
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
      >
        {!uploading && fileList.length < 1 && '+ Avatar'}
      </Upload>
    </ImgCrop>
  )
}

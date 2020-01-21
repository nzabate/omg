export interface UploadForm {
  file: Files;
  generalInfo: GeneralInfo;
  histories: string[];
  tag: TagInfo;
}

export interface UploadFormCollection {
  categories?: Category[];
  languages?: Language[];
  priorities?: Priority[];
  tags?: Tag[];
  qAs?: QA[];
}

export interface UploadInfo {
  fileName: string;
  description?: string;
  languageId?: number;
  categoryId: number;
  tags?: number[];
  priority?: number;
  status?: string;
  mainFileStorageId: string;
  referenceFiles: string[];
  remark?: string;
  qAs?: number[];
}

export interface UploadFormModel {
  designer: string;
  fileName: string;
  description: string;
  dateUploaded: string;
  categoryId: number;
  languageId: number;
  resourceId: number;
  tags?: any;
}

export interface UploadSaveDialog {
  fileName: string;
  sendType: string;
}

export interface ImageDetail {
  designer: string;
  fileName: string;
  description: string;
  dateUploaded: string;
  categoryId: number;
  languageId: number;
  category: Category;
  language: Language;
  resourceId: number;
  main: FileDetail;
  references: FileDetail[],
  histories: string[]
  tags: Tag[];
}

export interface LocalFile {
  name: string;
  file: File;
  base64: string;
}

export interface Category {
  key?: number;
  value?: string;
}

export interface Language {
  key?: number;
  value?: string;
}

export interface Priority {
  key?: number;
  value?: string;
}

export interface Tag {
  key: number;
  value: string;
}

export interface EntityTag {
  id: number;
  label: string;
}

export interface QA {
  key?: number;
  value?: string;
}

export interface QAForm {
  note: string;
  qAid: number;
}

export interface Files {
  main: FileDetail;
  references: FileDetail[];
}

export interface FileDetail {
  absoluteUri: string;
  fileStorageId?: string;
  fileType?: string;
  file?: File;
}

export interface GeneralInfo {
  categories: Category[];
  languages: Language[];
  model: UploadFormModel
}

export interface TagInfo {
  resourceTags: ResourceTag[];
  tags: Tag[];
}

export interface ResourceTag {
  id: number;
  resourceId: number;
  tagId: number;
  tag: EntityTag;
}

export interface SendMessage {
  resourceId: number;
  message: string;
}

export interface UpdateMainFile {
  resourceId: number;
  fileStorageId: string;
  fileName: string;
}

export interface DeleteReference {
  resourceId: number;
  fileStorageId: string;
}

export interface AddNewReference {
  resourceId: number;
  fileStorageId: string;
}

export interface ImageReviewResource {
  userId: number;
  name: string;
  avatar: string;
  position: string;
  messages: ImageReviewMessage[];
  main: FileDetail;
  references: FileDetail[];
}

export interface ImageReviewMessage {
  avatar: string;
  content: string;
  date: string;
  senderId: number;
  senderName: string;
}

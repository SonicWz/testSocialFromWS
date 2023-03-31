
export type PostsType = {
    id: number,
    title: string,
    postText: string,
    likes: number
}
export type ContactsType = {
    "github": string,
    "facebook": string,
    "vk": string
}
export type PhotosType = {
    "small": string,
    "large": string
}
export type ProfileType = {
    "id": number,
    "lookingForAJob": boolean | undefined,
    "lookingForAJobDescription": string | undefined,
    "contacts": ContactsType,
    "photos": PhotosType,
    "fullName": string
}
export type PostType = {
    "id": number | null,
    "title": string,
    "postText": string,
    "likes": number | null
}
export type UsersType = {
    "name": string,
    "id": number,
    "uniqueUrlName": string,
    "photos":  PhotosType,
    "location": {
        "country": string,
        "city": string
    },
    fullName: string,
    "status": string,
    "followed": boolean
}
export type UserType = {
    "name": string,
    "id": number,
    "uniqueUrlName": string,
    "photos": PhotosType,
    "location": {
        "country": string,
        "city": string
    },
    fullName: string,
    "status": string,
    "followed": boolean
}

export type getUsersOptionsType = {
    name?: string | null,
    city?: string | null,
    currentPage: number,
    pageSize: number,
    followed?: boolean
}
export type getFoundedUsersOptionsType = {
    name?: string | null,
    city?: string | null,
    currentPage: number,
    pageSize: number
}
export type getFoundedUsersArrayLengthOptionsType = {
    name?: string | null,
    city?: string | null,
}
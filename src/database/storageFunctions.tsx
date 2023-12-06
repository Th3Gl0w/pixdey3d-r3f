// import { supabase } from "./supabaseClient"

// // List all buckets in the storage
// export async function storageListBuckets(){
//     // Retrieve data in bucket
//     const { data, error} = await supabase
//     .storage
//     .listBuckets()

//     const bucketData = error||data
//     console.log(bucketData)
// }

// // List all files in bucket
// export async function storageListBucketFiles(bucketName: string){
//     const {data, error} = await supabase
//       .storage
//       .from(bucketName)
//       .list()

//       const bucketData = error||data
//       console.log(bucketData)
// }

// // Download a file from the bucket
// export async function storageDownloadBucketFiles(bucketName: string) {
//     const { data, error} = await supabase.storage.from(bucketName).download('folder/diagram.png')
//     console.log(error||data)
// }

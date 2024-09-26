import dotenv from 'dotenv';
dotenv.config();
const key=process.env.FS_API;
const url=process.env.FS_URL;
export const getconfig= async(req, res) =>{
    // console.log(key,url);
    res.status(200).json({
        key,
        url,
    });
}
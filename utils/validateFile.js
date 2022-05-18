export const isImage = file => {

   const { mimetype } = file;

   if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      throw new Error('Incorrect file');
   }
}
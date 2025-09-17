export function extractPublicId(path: string) {
    if (typeof path !== 'string' || !path.includes('.')) return null;
    
    const filenameWithExt = path.split('/').pop();
    const filename = filenameWithExt!.replace(/\.[^/.]+$/, '');
    
    return filename;
}

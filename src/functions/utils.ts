import { DefaultAzureCredential } from '@azure/identity';
import { AppendBlobClient, BlobServiceClient, ContainerClient } from '@azure/storage-blob';

export const getBlobClient = (accountUrl: string): BlobServiceClient => {
    return new BlobServiceClient(accountUrl, new DefaultAzureCredential());
}

export async function createContainer(blobServiceClient: BlobServiceClient, containerName: string): Promise<boolean> {
    const containerClient: ContainerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerReponse = await containerClient.createIfNotExists();
    if (createContainerReponse.succeeded) return true
    return false
}

export async function writeJsonLineToBlob(
    blobServiceClient: BlobServiceClient,
    containerName: string,
    blobName: string,
    data: any
): Promise<boolean> {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const appendBlobClient: AppendBlobClient = containerClient.getAppendBlobClient(blobName);

        const exists = await appendBlobClient.exists();
        if (!exists) {
            await appendBlobClient.create();
        }

        const jsonLine = JSON.stringify(data) + "\n";
        await appendBlobClient.appendBlock(jsonLine, Buffer.byteLength(jsonLine));

        return true;
    } catch (error) {
        console.error("Error writing to blob:", error);
        return false;
    }
}



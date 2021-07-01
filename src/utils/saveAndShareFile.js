import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { grabPdf } from "./downloadBinary";

function getFileUri(name) {
  return FileSystem.documentDirectory + `${encodeURI(name)}.pdf`;
}

export async function generatePdf(data, filename, endpoint) {
  const pdf = await grabPdf(data, endpoint);
  const fileUri = getFileUri(filename);
  await FileSystem.writeAsStringAsync(fileUri, pdf, {
    encoding: FileSystem.EncodingType.Base64,
  });
  await Sharing.shareAsync(fileUri);
}

import { JWT } from "google-auth-library";

// import creds from './config/myapp-1dd646d7c2af.json'; // the file saved above
import { GoogleSpreadsheet } from "google-spreadsheet";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

const jwt = new JWT({
  email: process.env.GOOGLE_AUTH_CLIENT_EMAIL,
  key: process.env.GOOGLE_AUTH_CLIENT_PRIVATE_KEY?.split(String.raw`\n`).join(
    "\n"
  ),
  scopes: SCOPES,
});
const doc = new GoogleSpreadsheet(
  "11YaceBCF3mSERhmOVzmeqq2ZcomYzIruAuCGDaAgJcY",
  //   "16TL_hBflzBGdgraz75S7GyZmXHnXanfb555Bx1NmLt8",
  jwt
);

type UserRow = { name: string } & string[];

export const getRows = async () => {
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle["Test Dyum"];
  const rows = await sheet.getRows<UserRow>();
  return rows.map((row) => {
    const { name, ...rest } = row.toObject();
    return {
      name,
      dateValues: Object.keys(rest) as string[],
      rdValues: Object.values(rest) as number[],
    };
  });
};

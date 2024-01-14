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
  //   "11YaceBCF3mSERhmOVzmeqq2ZcomYzIruAuCGDaAgJcY",
  "16TL_hBflzBGdgraz75S7GyZmXHnXanfb555Bx1NmLt8",
  jwt
);

type UserRow = { name: string; faction: string; alliance: string } & string[];
type DateRow = { dates: string };

export const getDates = async () => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["#forbes_date_tr"];
  const rows = await sheet.getRows<DateRow>();
  const dates: string[] = rows.map((row) => row.get("dates"));
  return dates;
};

export const getRowsValues = async () => {
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle["#forbes_data"];
  const rows = await sheet.getRows<UserRow>();
  console.log(rows);
  return rows.map((row) => {
    const { name, faction, alliance, ...rest } = row.toObject();
    return {
      name,
      faction,
      alliance,
      rdValues: Object.values(rest) as number[],
    };
  });
};

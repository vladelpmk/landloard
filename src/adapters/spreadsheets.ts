import { JWT } from "google-auth-library";

import credentials from "../config/retardapp-313cc34eea59.js"; // the file saved above
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Invoice } from "./types.js";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const DOC_ID = "11S1kKRmaBMdHROca-63aBSJGTJ4loQxbSvRE9ELTNsE";

export const addOrUpdateRow = async (
  invoice: Invoice,
  utility: string,
): Promise<void> => {
  const sheet = await getOrAddSheet(utility);

  const rows = await sheet.getRows();

  for (let row of rows) {
    const cellMonth = row.get("Month");
    const cellYear = row.get("Year");
    if (invoice.month === cellMonth && invoice.year === cellYear) {
      await insertAndSaveRow(invoice, row, undefined);
      return;
    }
  }
  await insertAndSaveRow(invoice, undefined, sheet);
};

const insertAndSaveRow = async (invoice, row, sheet) => {
  const rowData = {
    Year: invoice.year,
    Month: invoice.month,
    Amount: invoice.amount,
    Paid: invoice.paid ? "Yes" : "No",
  };

  if (!row) {
    await sheet.addRow(rowData);
    return;
  }
  await row.assign(rowData);
  await row.save();
};

const getOrAddSheet = async (sheetName) => {
  const doc = await getDocument();
  let sheet = doc.sheetsByTitle[sheetName];

  if (!sheet) {
    sheet = await doc.addSheet({
      title: sheetName,
      headerValues: ["Year", "Month", "Amount", "Paid"],
    });
  }
  return sheet;
};

const getDocument = async () => {
  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(DOC_ID, serviceAccountAuth);
  await doc.loadInfo();

  return doc;
};

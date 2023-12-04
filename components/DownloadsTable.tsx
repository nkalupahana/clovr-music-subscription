import {
  Skeleton,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Tab,
} from "@nextui-org/react";
import TableSongCell from "./TableSongCell";

export const DownloadsTable = ({ userDownloads }: { userDownloads: any[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableColumn>Song</TableColumn>
        <TableColumn>Date</TableColumn>
      </TableHeader>
      <TableBody>
        {userDownloads.map((download, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                <TableSongCell song={download.file} />
              </TableCell>
              <TableCell>{download.timestamp.split("T")[0]}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

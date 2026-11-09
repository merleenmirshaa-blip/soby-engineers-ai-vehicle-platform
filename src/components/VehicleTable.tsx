import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const vehicles = [
  {
    name: "Honda City",
    health: "95%",
    status: "Healthy",
    service: "20 Jul 2026",
  },
  {
    name: "Hyundai i20",
    health: "74%",
    status: "Service Due",
    service: "14 Jul 2026",
  },
  {
    name: "Maruti Swift",
    health: "88%",
    status: "Good",
    service: "10 Jul 2026",
  },
];

const VehicleTable = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Recent Vehicles
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Vehicle</b></TableCell>
            <TableCell><b>Health</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell><b>Last Service</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.name}>
              <TableCell>{vehicle.name}</TableCell>
              <TableCell>{vehicle.health}</TableCell>
              <TableCell>{vehicle.status}</TableCell>
              <TableCell>{vehicle.service}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default VehicleTable;
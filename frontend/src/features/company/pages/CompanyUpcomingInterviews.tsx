import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Person, VideoCall } from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  companyInterviewService,
  UpcomingInterviewResponseDTO,
} from "../services/InterviewReschedueService";

const ITEMS_PER_PAGE = 5;

const CompanyUpcomingInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await companyInterviewService.getUpcomingInterviews();
        setInterviews(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch upcoming interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const paginatedInterviews = interviews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleStartInterview = (roomId: string) => {
    navigate(`/company/interview/${roomId}`);
  };

  const handleViewApplication = (applicationId: string) => {
    navigate(`/company/job/application/${applicationId}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (interviews.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6">No upcoming interviews scheduled</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Interviews
      </Typography>

      {/* Desktop View */}
      <TableContainer
        component={Paper}
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Interview Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInterviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell>
                  <Typography variant="subtitle1">
                    {interview.applicationId.user.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {format(new Date(interview.scheduledAt), "PPpp")}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Person />}
                      onClick={() =>
                        handleViewApplication(interview.applicationId._id)
                      }
                    >
                      Application
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VideoCall />}
                      onClick={() => handleStartInterview(interview.roomId)}
                      disabled={new Date(interview.scheduledAt) > new Date()}
                    >
                      Join
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile View */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {paginatedInterviews.map((interview) => (
          <Card key={interview.id} sx={{ mb: 2 }}>
            <CardHeader title={`@${interview.companyId}`} />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {format(new Date(interview.scheduledAt), "PPpp")}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    handleViewApplication(interview.applicationId._id)
                  }
                  fullWidth
                >
                  Application
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleStartInterview(interview.roomId)}
                  disabled={new Date(interview.scheduledAt) > new Date()}
                  fullWidth
                >
                  Join
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(interviews.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default CompanyUpcomingInterviews;

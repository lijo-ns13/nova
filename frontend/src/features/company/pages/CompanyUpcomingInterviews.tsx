// InterviewListPage.tsx
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
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
import { Person, AccessTime, VideoCall } from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  companyInterviewService,
  UpcomingInterviewResponseDTO,
} from "../services/InterviewReschedueService";

const ITEMS_PER_PAGE = 5;

const CompanyUpcomingInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<UpcomingInterviewResponseDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
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
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
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
              <TableCell>Candidate</TableCell>
              <TableCell>Job Position</TableCell>
              <TableCell>Interview Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedInterviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={interview.user.profilePicture}
                      alt={interview.user.name}
                      sx={{ mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {interview.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {interview.user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">
                    {interview.job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {interview.job.location} • {interview.job.jobType}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {format(new Date(interview.interviewTime), "PPpp")}
                  </Typography>
                  <Chip
                    label={
                      new Date(interview.interviewTime) > new Date()
                        ? "Upcoming"
                        : "Started"
                    }
                    color={
                      new Date(interview.interviewTime) > new Date()
                        ? "primary"
                        : "success"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Person />}
                      onClick={() =>
                        handleViewApplication(interview.applicationId)
                      }
                    >
                      Application
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<VideoCall />}
                      onClick={() => handleStartInterview(interview.roomId)}
                      disabled={new Date(interview.interviewTime) > new Date()}
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
            <CardHeader
              avatar={
                <Avatar
                  src={interview.user.profilePicture}
                  alt={interview.user.name}
                />
              }
              title={interview.user.name}
              subheader={interview.user.email}
            />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Job Position
                  </Typography>
                  <Typography variant="body1">{interview.job.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {interview.job.location} • {interview.job.jobType}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Interview Time
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <AccessTime fontSize="small" sx={{ mr: 1 }} />
                    <Typography>
                      {format(new Date(interview.interviewTime), "PPpp")}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      new Date(interview.interviewTime) > new Date()
                        ? "Upcoming"
                        : "Started"
                    }
                    color={
                      new Date(interview.interviewTime) > new Date()
                        ? "primary"
                        : "success"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Divider />

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Person />}
                    onClick={() =>
                      handleViewApplication(interview.applicationId)
                    }
                    fullWidth
                  >
                    Application
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<VideoCall />}
                    onClick={() => handleStartInterview(interview.roomId)}
                    disabled={new Date(interview.interviewTime) > new Date()}
                    fullWidth
                  >
                    Join
                  </Button>
                </Stack>
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

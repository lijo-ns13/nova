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
import { ApplicationStatus } from "../../../constants/applicationStatus";

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
        console.log("interviews", data);
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

  const getJoinButtonOrStatus = (interview: any) => {
    const now = new Date();
    const scheduled = new Date(interview.scheduledAt);

    const joinStart = new Date(scheduled);
    joinStart.setMinutes(scheduled.getMinutes() - 5);

    const joinEnd = new Date(scheduled);
    joinEnd.setHours(scheduled.getHours() + 1);

    const status = interview.applicationId.status;

    if (
      status === ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER ||
      status === ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED
    ) {
      if (now < joinStart) {
        return (
          <Typography variant="body2" color="textSecondary">
            Interview not started yet
          </Typography>
        );
      } else if (now > joinEnd) {
        return (
          <Typography variant="body2" color="textSecondary">
            Interview ended
          </Typography>
        );
      } else {
        return (
          <Button
            variant="contained"
            size="small"
            startIcon={<VideoCall />}
            onClick={() => handleStartInterview(interview.roomId)}
          >
            Join
          </Button>
        );
      }
    } else {
      return (
        <Typography variant="body2" color="error">
          User has not accepted interview
        </Typography>
      );
    }
  };

  // --- Helper to check Join button visibility ---
  // const isJoinAvailable = (scheduledAt: string) => {
  //   const now = new Date();
  //   const start = new Date(scheduledAt);

  //   const joinStart = new Date(start);
  //   joinStart.setMinutes(start.getMinutes() - 5); // 5 minutes before start

  //   const joinEnd = new Date(start);
  //   joinEnd.setHours(start.getHours() + 1); // 1 hour after start

  //   return now >= joinStart && now <= joinEnd;
  // };

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

                    {getJoinButtonOrStatus(interview)}
                  </Stack>

                  {/* <Stack direction="row" spacing={1}>
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

                    {isJoinAvailable(interview.scheduledAt) && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<VideoCall />}
                        onClick={() => handleStartInterview(interview.roomId)}
                      >
                        Join
                      </Button>
                    )}
                  </Stack> */}
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
            <CardHeader title={`@${interview.applicationId.user.name}`} />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {format(new Date(interview.scheduledAt), "PPpp")}
              </Typography>
              {/* <Stack direction="row" spacing={1}>
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

                {isJoinAvailable(interview.scheduledAt) && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleStartInterview(interview.roomId)}
                    fullWidth
                  >
                    Join
                  </Button>
                )}
                

              </Stack> */}
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

                {getJoinButtonOrStatus(interview)}
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

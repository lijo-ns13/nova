# Nova Job Application

Nova Job is a comprehensive platform designed to connect job seekers with companies, facilitating seamless job applications while promoting active user engagement. The application features advanced social interactions such as post management with nested comments and likes, real-time networking through chatting and video calls, and robust user profile and subscription management.

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS  
- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** MongoDB  
- **Architecture & Patterns:** Repository Pattern, SOLID principles, OOP design  
- **Real-time & Communication:** Socket.IO, PeerJS (Video Calls)  
- **Media Storage:** AWS S3 Bucket  
- **Payments:** Stripe integration for subscriptions  
- **Dependency Injection:** InversifyJS  
- **State & Query Management:** TanStack Query  
- **Visualization:** Chart.js  

---

## Key Features

- User registration and profile management  
- Job search and application functionality  
- Post management with nested comments and likes  
- Real-time chatting and video calls between users  
- Subscription plans with Stripe payment integration  
- Media upload and management via AWS S3  
- Robust architecture using repository pattern and dependency injection  
- Real-time updates using Socket.IO  
- Interactive dashboards with charts using Chart.js  

---

## Setup and Installation

### Prerequisites

- Node.js (v16+ recommended)  
- MongoDB (local or cloud instance)  
- AWS account with an S3 bucket configured  
- Stripe account for payment integration  
- PeerJS server (or hosted service)  
- Yarn or npm package manager  

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/nova-job-app.git
    cd nova-job-app/backend
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Configure environment variables:

    Create a `.env` file in the backend folder with the following keys:

    ```ini
    MONGODB_URI=your_mongodb_connection_string
    AWS_ACCESS_KEY_ID=your_aws_access_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret_key
    AWS_S3_BUCKET_NAME=your_bucket_name
    STRIPE_SECRET_KEY=your_stripe_secret_key
    PEERJS_SERVER_URL=your_peerjs_server_url
    JWT_SECRET=your_jwt_secret
    ```

4. Start the backend server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Configure environment variables:

    Create a `.env` file in the frontend folder with:

    ```ini
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_PEERJS_SERVER=your_peerjs_server_url
    ```

4. Start the frontend development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

---

## Usage

- Register or log in as a job seeker or company.  
- Explore and apply for jobs.  
- Post updates, comment, and like posts to engage with the community.  
- Use chat and video calls to network with other users.  
- Manage subscriptions and payments securely via Stripe.  
- Upload and manage media files seamlessly with AWS S3 integration.  

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

## License

Specify your project license here (e.g., MIT License).

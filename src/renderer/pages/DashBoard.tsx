import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Activity,
  Book,
  Users,
  Calendar,
  AlertCircle,
  BookOpen,
  RefreshCcw,
  UserCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the chart
const borrowingData = [
  { date: "Mon", books: 24 },
  { date: "Tue", books: 35 },
  { date: "Wed", books: 45 },
  { date: "Thu", books: 30 },
  { date: "Fri", books: 55 },
  { date: "Sat", books: 20 },
  { date: "Sun", books: 15 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Banner with Welcome Message */}
      <div className='bg-blue-600 text-white p-8'>
        <h1 className='text-3xl font-bold mb-2'>
          Welcome to Library Management System
        </h1>
        <p className='text-blue-100'>
          Today's Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Quick Actions Bar */}
      <div className='bg-white border-b shadow-sm p-4'>
        <div className='max-w-7xl mx-auto flex gap-4 overflow-x-auto'>
          <button className='flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'>
            <Book className='w-5 h-5 text-blue-600' />
            <span>Issue Book</span>
          </button>
          <button className='flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors'>
            <RefreshCcw className='w-5 h-5 text-green-600' />
            <span>Return Book</span>
          </button>
          <button className='flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors'>
            <UserCheck className='w-5 h-5 text-purple-600' />
            <span>Add Member</span>
          </button>
          <button className='flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors'>
            <BookOpen className='w-5 h-5 text-orange-600' />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto p-6'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Books
                  </p>
                  <p className='text-2xl font-bold'>12,458</p>
                </div>
                <div className='p-3 bg-blue-100 rounded-full'>
                  <Book className='w-6 h-6 text-blue-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm text-gray-600'>
                <span className='text-green-500 flex items-center'>
                  <Activity className='w-4 h-4 mr-1' />
                  +2.5%
                </span>
                <span className='ml-2'>from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Active Members
                  </p>
                  <p className='text-2xl font-bold'>1,245</p>
                </div>
                <div className='p-3 bg-green-100 rounded-full'>
                  <Users className='w-6 h-6 text-green-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm text-gray-600'>
                <span className='text-green-500 flex items-center'>
                  <Activity className='w-4 h-4 mr-1' />
                  +12%
                </span>
                <span className='ml-2'>new registrations</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Books Due Today
                  </p>
                  <p className='text-2xl font-bold'>28</p>
                </div>
                <div className='p-3 bg-orange-100 rounded-full'>
                  <Calendar className='w-6 h-6 text-orange-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm text-orange-600'>
                <AlertCircle className='w-4 h-4 mr-1' />
                <span>Requires attention</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Overdue Books
                  </p>
                  <p className='text-2xl font-bold'>15</p>
                </div>
                <div className='p-3 bg-red-100 rounded-full'>
                  <AlertCircle className='w-6 h-6 text-red-600' />
                </div>
              </div>
              <div className='mt-4 flex items-center text-sm text-red-600'>
                <span>Total fines: $125.50</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Borrowing Chart */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Weekly Borrowing Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={borrowingData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='books'
                    stroke='#2563eb'
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips for New Librarians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>Daily Tasks</h3>
                <ul className='space-y-2 text-gray-600'>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full' />
                    Check for due books and send reminders
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full' />
                    Process new book returns
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full' />
                    Update member records
                  </li>
                </ul>
              </div>
              <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>Common Procedures</h3>
                <ul className='space-y-2 text-gray-600'>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full' />
                    Use the barcode scanner for quick book processing
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full' />
                    Always verify member ID before issuing books
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-600 rounded-full' />
                    Check book condition during returns
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

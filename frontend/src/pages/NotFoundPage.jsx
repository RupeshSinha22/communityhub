const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
      <a href="/" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
        Go Home
      </a>
    </div>
  );
};

export default NotFoundPage;

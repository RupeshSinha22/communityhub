const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
      <a href="/" className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition font-medium">
        Go Home
      </a>
    </div>
  );
};

export default NotFoundPage;

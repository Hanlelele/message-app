import { withAuth } from 'next-auth/middleware';

export default withAuth({
    //signIn: Đường dẫn đến trang đăng nhập.
    //Trong trường hợp này, khi người dùng chưa đăng nhập và cố gắng truy cập vào các tuyến đường được bảo vệ, họ sẽ được chuyển hướng đến trang chủ ('/').

    pages: {
        signIn: '/',
    },
});

// '/users/:path*': Cấu hình này có nghĩa là bất kỳ tuyến đường nào bắt đầu bằng /users/ đều sẽ được bảo vệ bởi middleware.
// Ví dụ, /users/profile, /users/settings đều sẽ yêu cầu người dùng phải đăng nhập.
export const config = {
    matcher: ['/users/:path*', '/conversations/:path*'],
};

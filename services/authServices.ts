
export interface FakeLoginResponse {
    status: number;
    data: {
      token: string;
    };
  }
  
  export const fakeLogin = (email: string, pass: string): Promise<FakeLoginResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('@') && pass.length > 0) {
          console.log(`Fake login successful for ${email}`);
          resolve({
            status: 200,
            data: {
              token: `fake-jwt-token-for-${email}-${Date.now()}`,
            },
          });
        } else {
          console.warn(`Fake login failed for ${email}`);
          resolve({
              status: 401,
              data: { token: '' }
          });
        }
      }, 500);
    });
  };
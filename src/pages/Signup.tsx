
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "@/components/auth/AuthForm";

const Signup = () => {
  return (
    <Layout>
      <div className="container max-w-lg py-16 px-4 md:px-0">
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your CSC account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm type="signup" />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-purple font-medium hover:underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Signup;

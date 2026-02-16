"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as React from "react";
import {
  Controller,
  DefaultValues,
  FieldValues,
  FormProvider,
  Path,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";

const FORM_ID = "form-auth";

function getFieldLabel(name: string): string {
  if (name === "email") return "Email Address";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  type FormValues = z.infer<z.ZodType<T>>;
  const form = useForm<FormValues>({
    resolver: zodResolver(
      schema as Parameters<typeof zodResolver>[0]
    ) as Resolver<FormValues>,
    defaultValues: defaultValues as DefaultValues<FormValues>,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    await onSubmit(data as T);
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <FormProvider {...form}>
      <form
        id={FORM_ID}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        <FieldGroup>
          {(Object.keys(defaultValues) as Path<FormValues>[]).map((name) => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${FORM_ID}-${name}`}>
                    {getFieldLabel(name)}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`${FORM_ID}-${name}`}
                    type={name === "password" ? "password" : "text"}
                    aria-invalid={fieldState.invalid}
                    autoComplete={name === "email" ? "email" : undefined}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          ))}
        </FieldGroup>

        <Button
          type="submit"
          form={FORM_ID}
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter text-light-900!"
        >
          {form.formState.isSubmitting
            ? buttonText === "Sign In"
              ? "Signing In..."
              : "Signing Up..."
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient"
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </FormProvider>
  );
};

export default AuthForm;

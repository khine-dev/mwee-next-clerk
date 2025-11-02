import React from "react";

export type Props_Type_With_Children = Readonly<{
    children: React.ReactNode
}>

export type With_Clildren_And<T> = Readonly<Props_Type_With_Children & T>;

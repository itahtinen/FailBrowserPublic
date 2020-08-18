// Learn more about F# at http://fsharp.org
// This is where your schema etc goes. Crudo is just a library!
open Crudo
open Db
open SqlFrags.SqlGen
open SchemaGen

let createSchema() =
    startSchema "Demoschema"
    // declare tables
    let suite = Table "T_SUITE"
    decl suite [
        Prim "ID"
        Summ "NAME"
        foreign "PARENTID" suite
        Col "SOURCE"
    ]
    let case = Table "T_CASE"
    decl case [
        Prim "ID"
        Summ "NAME"
        foreign "SUITEID" suite
    ]

    let log = Table "T_LOG"
    decl log [
        Prim "ID"
    ]

    let sample = Table "T_SAMPLE"
    decl sample [
        Prim "ID"
        Col "STATUS"
        Summ "NAME"
        foreign "CASEID" case
        foreign "LOGID" log
    ]

        
    finalize()
    
module ConnectionConfig =
    open Db.DbConnector

    //let mssql =
    //    typeof<System.Data.SqlClient.SqlConnection>.AssemblyQualifiedName

    //let oracle = typeof<Oracle.ManagedDataAccess.Client.OracleConnection>.AssemblyQualifiedName
    
    let mysql = typeof<MySql.Data.MySqlClient.MySqlConnection>.AssemblyQualifiedName
    let GetConnectors() = [
          "mysql",
          Connector(mysql, 
            "Host=localhost;Port=3306;Username=root;Password=fail;Database=fb;"
          )
(*          
          "oracle",
          Connector(oracle,          
                  ConnectionString [ DataSource "DOCKER"
                                     UserId Secrets.Username
                                     Password Secrets.Password])
                  

          "local",
          Connector(mssql,
                    ConnectionString [ DataSource "localhost"
                                       Catalog "IA"
                                       IntegratedSecurity true ])
                                       
*)
                                       ]

    let Init() = DefaultConnector <- GetConnectors().[0] |> snd

let boot() =
    createSchema()
    ConnectionConfig.Init()
    // host, port
    CrudoSql.StartCrudo "0.0.0.0" 9988

[<EntryPoint>]
let main _ =
    boot()
    0

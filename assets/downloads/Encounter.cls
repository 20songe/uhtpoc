Class uhtpoc.Encounter Extends %Persistent [ ClassType = persistent, DdlAllowed, Final, Owner = {SuperUser}, ProcedureBlock, SqlRowIdPrivate, SqlTableName = Encounter ]
{

Property mrn As %Library.String(MAXLEN = 20) [ SqlColumnNumber = 2 ];

Property date As %Library.Date [ SqlColumnNumber = 3, SqlFieldName = encounter_date ];

Property encounterNum As %Library.Integer [ SqlColumnNumber = 4, SqlFieldName = encounter_number ];

Property encounterType As %Library.String(MAXLEN = 50) [ SqlColumnNumber = 5, SqlFieldName = encounter_type ];

Storage Default
{
<Data name="EncounterDefaultData">
<Value name="1">
<Value>mrn</Value>
</Value>
<Value name="2">
<Value>date</Value>
</Value>
<Value name="3">
<Value>encounterNum</Value>
</Value>
<Value name="4">
<Value>encounterType</Value>
</Value>
</Data>
<DataLocation>^uhtpoc.EncounterD</DataLocation>
<DefaultData>EncounterDefaultData</DefaultData>
<IdLocation>^uhtpoc.EncounterD</IdLocation>
<IndexLocation>^uhtpoc.EncounterI</IndexLocation>
<StreamLocation>^uhtpoc.EncounterS</StreamLocation>
<Type>%Storage.Persistent</Type>
}

}

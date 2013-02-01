#! /usr/bin/perl

#takes xml file of news stories from broadcast news and returns a csv file of subject and number

%subjects;


while(<>){
	chomp();

	if ( /(inm:Subject>)(.*)(<\/inm:Subject>)/ ){
		$subjects{$2}++;
	}	

}

print "subject,number\n";
foreach my $key (keys %subjects ){
	print "\"$key\",$subjects{$key}\n";
}

